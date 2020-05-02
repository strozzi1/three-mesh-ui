/*
	Job: Keeping track and deciding of a component's InlineComponents position, split, etc..
	Knows: Component Dimension, and the list of children InlineComponent
*/

import { ShapeBufferGeometry } from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import MeshUIComponent from './MeshUIComponent';

function InlineManager( boxComponent ) {

	// if a property is not found in layout, it will delegate to MeshUIComponent
	const inlineManager = Object.create( MeshUIComponent() );

	inlineManager.type = 'inlineManager'

	inlineManager.inlineComponents = [];

	// Updated by computeInlinesPosition, and read by InlineComponent.setPosFromParentRecords()
	inlineManager.inlinesInfo = {};

	inlineManager.computeInlinesPosition = function computeInlinesPosition() {

		if ( this.children.length === 0 ) return

		inlineManager.inlinesInfo = {};

		this.children.reduce( (lastInlineInfo, inline, i)=> {

			// Abort condition

			if ( !inline.isInline ) {
				console.warn("A component cannot have a box and an inline child component at the same time");
			};

			if ( !inline.chars ) return

			// Compute the position of each inline children according to its geometry

			let chars = inline.chars.slice(0);

			const thisInlineInfo = chars.reduce( (lastCharInfo, char)=> {

				char.geometry.translate( lastCharInfo.offsetX, 0, 0 );

				lastCharInfo = {
					offsetX: lastCharInfo.offsetX + (char.width / 2)
				};

				return lastCharInfo

			}, lastInlineInfo );

			// Merge the chars geometries

			const mergedGeom = BufferGeometryUtils.mergeBufferGeometries(
				chars.map(char => char.geometry),
				true
			);

			// Update records

			inlineManager.inlinesInfo[ inline.id ] = {
				x: 0,
				y: 0,
				z: 0,
				geometry: mergedGeom
			};

			//

			return thisInlineInfo

		}, { offsetX: 0, offsetY: 0 } );

	};

	return inlineManager

};

export default InlineManager